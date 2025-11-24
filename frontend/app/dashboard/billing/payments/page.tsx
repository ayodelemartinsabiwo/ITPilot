'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Receipt
} from 'lucide-react'
import { billingService, Payment, PaymentMethod } from '@/lib/api/services/billing.service'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [paymentsRes, methodsRes] = await Promise.all([
        billingService.getPayments(),
        billingService.getPaymentMethods()
      ])
      if (paymentsRes.data) setPayments(paymentsRes.data)
      if (methodsRes.data) setPaymentMethods(methodsRes.data)
    } catch (err: any) {
      console.error('Error fetching payment data:', err)
      setError(err.message || 'Failed to load payment data')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats
  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
  const successfulPayments = payments.filter(p => p.status === 'completed').length
  const failedPayments = payments.filter(p => p.status === 'failed').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">View and manage your payment history</p>
        </div>
        <Button variant="primary">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : `$${totalPaid.toFixed(2)}`}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : successfulPayments}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : failedPayments}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button variant="outline" size="sm">
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No payment methods added</p>
              <p className="text-sm mt-2">Add a payment method to start your subscription</p>
              <Button variant="primary" className="mt-4">
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : 'Bank Transfer'}
                      </p>
                      {method.exp_month && method.exp_year && (
                        <p className="text-sm text-gray-600">Expires {method.exp_month}/{method.exp_year}</p>
                      )}
                    </div>
                  </div>
                  {method.is_default && (
                    <Badge variant="success">Default</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No payment history</p>
              <p className="text-sm mt-2">Your payment transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'completed' ? 'bg-green-100' :
                      payment.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {payment.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : payment.status === 'failed' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-600">{new Date(payment.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{payment.currency} {payment.amount.toFixed(2)}</p>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No upcoming payments</p>
            <p className="text-sm mt-2">Your scheduled payments will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
