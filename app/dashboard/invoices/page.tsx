'use client'

import { useState, useEffect } from 'react'

interface Invoice {
  id: string
  invoice_number: string
  booking_id: string
  amount: number
  status: string
  due_date: string
  created_at: string
  booking: {
    customer_name: string
    customer_email: string
    total_price: number
    booking_date: string
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch invoices')
        return
      }

      setInvoices(data.invoices)
    } catch (err) {
      setError('An error occurred while fetching invoices')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === 'all') return true
    return invoice.status === filter
  })

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = filteredInvoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and track all customer invoices
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            ${totalAmount.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">All invoices</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Paid</p>
          <p className="mt-2 text-3xl font-bold text-green-600">${paidAmount.toFixed(2)}</p>
          <p className="mt-2 text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            ${pendingAmount.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Awaiting payment</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{filteredInvoices.length}</p>
          <p className="mt-2 text-xs text-muted-foreground">Issued</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'paid', 'overdue', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading invoices...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-lg font-medium text-foreground mb-2">No invoices found</p>
          <p className="text-muted-foreground">
            {filter === 'all'
              ? 'Create bookings to generate invoices'
              : `No ${filter} invoices`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm text-foreground">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {invoice.booking?.customer_name || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.booking?.customer_email || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(invoice.due_date).toLocaleDateString()}
                    {isOverdue(invoice.due_date) && invoice.status !== 'paid' && (
                      <p className="text-xs text-red-600 font-medium">Overdue</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
