import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  
  try {
    const { data, error } = await client
      .from('user_balances')
      .select('usd_balance, btc_balance')
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})