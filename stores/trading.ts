import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'

interface Trade {
  price: number
  amount: number
  type: 'buy' | 'sell'
  timestamp: number
}

interface OrderBook {
  bids: [number, number][] // [price, amount]
  asks: [number, number][] // [price, amount]
}

interface Balance {
  usd: number
  btc: number
}

interface TradingState {
  currentPrice: number
  trades: Trade[]
  orderBook: OrderBook
  balance: Balance
  loading: boolean
  error: string | null
}

export const useTradingStore = defineStore('trading', {
  state: (): TradingState => ({
    currentPrice: 50000,
    trades: [],
    orderBook: {
      bids: [],
      asks: []
    },
    balance: {
      usd: 0,
      btc: 0
    },
    loading: false,
    error: null
  }),

  actions: {
    async loadUserBalance() {
      this.loading = true
      this.error = null

      try {
        const response = await useFetch('/api/trading/balance')
        const data = response.data.value
        
        if (data) {
          this.balance.usd = data.usd_balance
          this.balance.btc = data.btc_balance
        }
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateBalance(newBalance: Balance) {
      const supabase = useSupabaseClient()
      
      try {
        const { error } = await supabase
          .from('user_balances')
          .update({
            usd_balance: newBalance.usd,
            btc_balance: newBalance.btc,
            updated_at: new Date().toISOString()
          })
          .single()

        if (error) throw error
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async loadTrades() {
      try {
        const response = await useFetch('/api/trading/trades')
        const data = response.data.value
        
        if (data) {
          this.trades = data.map((trade: any) => ({
            price: trade.price,
            amount: trade.amount,
            type: trade.type,
            timestamp: new Date(trade.created_at).getTime()
          }))
        }
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async placeBuyOrder(price: number, amount: number) {
      if (price * amount <= this.balance.usd) {
        const supabase = useSupabaseClient()
        
        const newBalance = {
          usd: this.balance.usd - price * amount,
          btc: this.balance.btc + amount
        }

        try {
          const { error: tradeError } = await supabase
            .from('trades')
            .insert({
              type: 'buy',
              price,
              amount
            })

          if (tradeError) throw tradeError

          await this.updateBalance(newBalance)
          
          this.balance = newBalance
          this.trades.push({
            price,
            amount,
            type: 'buy',
            timestamp: Date.now()
          })
        } catch (error: any) {
          this.error = error.message
          throw error
        }
      }
    },

    async placeSellOrder(price: number, amount: number) {
      if (amount <= this.balance.btc) {
        const supabase = useSupabaseClient()
        
        const newBalance = {
          usd: this.balance.usd + price * amount,
          btc: this.balance.btc - amount
        }

        try {
          const { error: tradeError } = await supabase
            .from('trades')
            .insert({
              type: 'sell',
              price,
              amount
            })

          if (tradeError) throw tradeError

          await this.updateBalance(newBalance)
          
          this.balance = newBalance
          this.trades.push({
            price,
            amount,
            type: 'sell',
            timestamp: Date.now()
          })
        } catch (error: any) {
          this.error = error.message
          throw error
        }
      }
    },

    updateOrderBook() {
      const spread = 100
      const basePrice = this.currentPrice
      
      this.orderBook.bids = Array.from({ length: 10 }, (_, i) => {
        return [basePrice - (i + 1) * spread, Math.random() * 2]
      })
      
      this.orderBook.asks = Array.from({ length: 10 }, (_, i) => {
        return [basePrice + (i + 1) * spread, Math.random() * 2]
      })
    },

    simulatePriceMovement() {
      this.currentPrice += (Math.random() - 0.5) * 100
      this.updateOrderBook()
    }
  }
})