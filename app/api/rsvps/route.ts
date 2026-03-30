import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const {
      gameId,
      playerName,
      playerPhone,
      status = 'confirmed',
      foodPreferences = [],
    } = body

    // Validate required fields
    if (!gameId || !playerName || !playerPhone) {
      return NextResponse.json(
        { error: '請填寫所有必填欄位' },
        { status: 400 }
      )
    }

    // Validate phone format (Taiwan mobile)
    const phoneRegex = /^09\d{8}$/
    if (!phoneRegex.test(playerPhone.replace(/[-\s]/g, ''))) {
      return NextResponse.json(
        { error: '請輸入有效的台灣手機號碼' },
        { status: 400 }
      )
    }

    // Check if game exists and is active
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, max_seats, status')
      .eq('id', gameId)
      .single()

    if (gameError || !game) {
      return NextResponse.json(
        { error: '找不到此遊戲' },
        { status: 404 }
      )
    }

    if (game.status !== 'active') {
      return NextResponse.json(
        { error: '此遊戲已關閉報名' },
        { status: 400 }
      )
    }

    // Check if game is full (only for confirmed RSVPs)
    if (status === 'confirmed') {
      const { count, error: countError } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', gameId)
        .eq('status', 'confirmed')

      if (countError) {
        console.error('Error counting RSVPs:', countError)
      } else if (count !== null && count >= game.max_seats) {
        return NextResponse.json(
          { error: '名額已滿' },
          { status: 400 }
        )
      }
    }

    // Check for duplicate phone number
    const { data: existingRsvp, error: duplicateError } = await supabase
      .from('rsvps')
      .select('id')
      .eq('game_id', gameId)
      .eq('player_phone', playerPhone)
      .maybeSingle()

    if (duplicateError && duplicateError.code !== 'PGRST116') {
      console.error('Error checking duplicate:', duplicateError)
    }

    if (existingRsvp) {
      return NextResponse.json(
        { error: '此手機號碼已經報名過了' },
        { status: 400 }
      )
    }

    // Insert RSVP
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .insert({
        game_id: gameId,
        player_name: playerName,
        player_phone: playerPhone,
        status,
        food_preferences: foodPreferences.length > 0 ? foodPreferences : null,
      })
      .select()
      .single()

    if (rsvpError) {
      console.error('Error creating RSVP:', rsvpError)
      return NextResponse.json(
        { error: '報名失敗，請稍後再試' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        id: rsvp.id,
        playerName: rsvp.player_name,
        playerPhone: rsvp.player_phone,
        status: rsvp.status,
        foodPreferences: rsvp.food_preferences || [],
        createdAt: rsvp.created_at,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: '系統錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}
