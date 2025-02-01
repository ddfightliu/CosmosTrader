import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  
  try {
    const { data, error } = await client
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

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