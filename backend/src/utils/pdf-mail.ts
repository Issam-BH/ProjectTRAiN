import PDFDocument from 'pdfkit'
import nodemailer from 'nodemailer'

export async function generateTicketPDF(billet: any, trajet: any, passager: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        const buffers: Buffer[] = []
        
        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => resolve(Buffer.concat(buffers)))
        doc.on('error', reject)
        doc.fontSize(25).fillColor('#ea580c').text('TRAiN', { align: 'center' })
        doc.fontSize(16).fillColor('#1e3a8a').text('Votre Billet de Train', { align: 'center' })
        doc.moveDown()
        
        doc.fillColor('black').fontSize(12)
        doc.text(`Référence du Billet : ${billet.identifiant}`)
        doc.text(`Passager : ${passager}`)
        doc.moveDown()
        
        doc.text(`Départ : ${trajet.gare_depart}`)
        doc.text(`Arrivée : ${trajet.gare_arrivee}`)
        doc.text(`Date : ${new Date(trajet.date).toLocaleDateString('fr-FR')} à ${trajet.heure_depart}`)
        doc.text(`Arrivée prévue : ${trajet.heure_arrive}`)
        doc.moveDown()
        
        const options = billet.reservation.options && billet.reservation.options.length > 0 
            ? billet.reservation.options.map((o: any) => o.nom).join(', ') 
            : 'Aucune'
            
        doc.text(`Options choisies : ${options}`)
        doc.moveDown(4)
        doc.fontSize(10).fillColor('gray').text('Veuillez présenter ce billet lors de votre contrôle.', { align: 'center' })
        
        doc.end()
    })
}

export async function sendTicketEmail(email: string, pdfBuffer: Buffer, reference: string) {
    const testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
    })

    const info = await transporter.sendMail({
        from: '"TRAiN Réservation" <contact@train.com>',
        to: email,
        subject: `Vos billets de train - Réf: ${reference}`,
        text: "Merci pour votre réservation sur TRAiN. Veuillez trouver vos billets au format PDF en pièce jointe.",
        attachments: [{
            filename: `billets-${reference}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
        }]
    })

    console.log("✅ Email envoyé ! Lien pour voir l'email de test : %s", nodemailer.getTestMessageUrl(info))
}