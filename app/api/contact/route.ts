import { NextRequest, NextResponse } from "next/server"

interface ContactFormData {
  ad: string
  soyad: string
  email: string
  mesaj: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    const { ad, soyad, email, mesaj } = body

    if (!ad || !soyad || !email || !mesaj) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur. Lütfen formu eksiksiz doldurun." },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      )
    }

    // Prepare payload with timestamp
    const payload = {
      firstName: ad.trim(),
      lastName: soyad.trim(),
      email: email.trim().toLowerCase(),
      message: mesaj.trim(),
      timestamp: new Date().toISOString(),
    }

    // Target n8n webhook URL
    const webhookUrl = "https://seymaaa12.app.n8n.cloud/webhook/portfolio-contact"

    if (webhookUrl) {
      // Send to external webhook (e.g., n8n)
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!webhookResponse.ok) {
        console.error("Webhook error:", webhookResponse.status, webhookResponse.statusText)
        return NextResponse.json(
          { error: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin." },
          { status: 500 }
        )
      }
    } else {
      // Log the message if no webhook is configured (for development)
      console.log("Contact form submission (no webhook configured):", payload)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Mesajınız başarıyla gönderildi!" 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    )
  }
}
