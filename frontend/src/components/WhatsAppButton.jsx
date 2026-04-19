const whatsappNumber = '919876543210'

function WhatsAppButton() {
  const message = encodeURIComponent('Hello GRK Aluminium Works, I need a quote for aluminium work.')

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      className="whatsapp-float"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      WhatsApp
    </a>
  )
}

export default WhatsAppButton
