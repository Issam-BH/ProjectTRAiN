import PDFDocument from 'pdfkit'
import nodemailer from 'nodemailer'

export async function generateTicketPDF(billetsData: any[], passager: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        const buffers: Buffer[] = []
        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => resolve(Buffer.concat(buffers)))
        doc.on('error', reject)

        billetsData.forEach((item, index) => {
            if (index > 0) doc.addPage()
            const { billet, trajet } = item
            doc.fontSize(25).fillColor('#ea580c').text('TRAiN', { align: 'center' })
            doc.fontSize(16).fillColor('#1e3a8a').text(`Billet ${item.billet.reservation.type.toUpperCase()}`, { align: 'center' })
            doc.moveDown()
            doc.fillColor('black').fontSize(12)
            doc.text(`Référence : ${billet.identifiant}`)
            doc.text(`Passager : ${passager}`)
            doc.moveDown()
            doc.text(`Départ : ${trajet.gare_depart}`)
            doc.text(`Arrivée : ${trajet.gare_arrivee}`)
            doc.text(`Date : ${new Date(trajet.date).toLocaleDateString('fr-FR')} à ${trajet.heure_depart}`)
            doc.moveDown()
            
            const optionsNames = billet.reservation.options?.map((o: any) => o.nom);
            const optionsTxt = (optionsNames && optionsNames.length > 0) ? optionsNames.join(', ') : 'Aucune option';
            
            doc.text(`Options choisies : ${optionsTxt}`)
        })
        doc.end()
    })
}

export async function sendTicketEmail(email: string, pdfBuffer: Buffer, reference: string) {
    const testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", port: 587, secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
    })
    await transporter.sendMail({
        from: '"TRAiN" <contact@train.com>',
        to: email,
        subject: `Billets TRAiN - Réf: ${reference}`,
        text: "Voici vos billets en pièce jointe.",
        attachments: [{ filename: `billets-${reference}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
    })
}