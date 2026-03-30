const Event = require('../models/event');
const User = require('../models/user');
const BookingDetails = require('../models/bookingDetails');
const Invoice = require('../models/invoice');
const PDFDocument = require('pdfkit');
const fs = require('fs');

async function handleBooking(req, res) {
        const { amount, numberOfSeats } = req.body;
        // const totalAmount = amount * numberOfSeats;
        const { slug } = req.params;
        const user = req.user;
        try {
            const event = await Event.findOne({ slug });
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            const bookingDetails = {
                eventId: event._id,
                userId: user._id,
                amount,
                numberOfSeats,
                status: 'Booked',
            };
            const newBooking = new BookingDetails(bookingDetails);
            await newBooking.save();
            


            const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
            const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;


            const invoice = new Invoice({
                invoiceNumber: nextInvoiceNumber,
                bookingId: event._id,
                userId: user._id,
                amount,
                numberOfSeats,
                eventName: event.title,
                eventVenue: event.venue,
                eventDate: event.eventDate,
                eventTime: event.startTime,
                status: 'Paid',
            });
            await invoice.save();

            await generatePdfTicket(invoice);


            res.status(200).json({ message: 'Booking successful', invoice });
        } catch (error) {
            console.error('Error during booking:', error);
            res.status(500).json({ message: 'Internal server error' });
        }   
}


async function generatePdfTicket(invoice) {
    const doc = new PDFDocument();
    const user = await User.findById(invoice.userId);

    doc.text(`Invoice---${invoice.invoiceNumber}`);
    doc.text(`User ID: ${user.firstName} ${user.lastName} (${user.email})`);
    doc.text(`Event Name: ${invoice.eventName}`);
    doc.text(`Venue: ${invoice.eventVenue} `);
    
    
    doc.text(`Event Date: ${invoice.eventDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`);
    
    doc.text(`Event Time: ${invoice.eventTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`);


    doc.text(`Number of Seats: ${invoice.numberOfSeats}`);
    doc.text(`Amount: ${invoice.amount} * ${invoice.numberOfSeats} = ${invoice.amount * invoice.numberOfSeats}`);
    doc.text(`Status: ${invoice.status}`);
    
    
    doc.text(`Booking Date and Time: ${new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`);

    doc.end();

    doc.pipe(fs.createWriteStream(`ticket_${invoice.eventName}_${user.firstName}.pdf`));
}


// async function generatePdfTicket(invoice) {
//     const doc = new PDFDocument({ size: 'A4', margin: 50 });
//     const user = await User.findById(invoice.userId);
//     const event = await Event.findById(invoice.bookingId);
//     const fileName = `${user.firstName}_${invoice.invoiceNumber}.pdf`;
    
//     doc.pipe(fs.createWriteStream(fileName));

//     const primaryColor = '#004a99';
//     const textColor = '#333333';

//     doc.fillColor(primaryColor)
//        .fontSize(24)
//        .text(`${event.title}`, { align: 'center' });
    
//     doc.moveDown();
//     doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, 100).lineTo(545, 100).stroke();
//     doc.moveDown();

//     doc.fillColor(textColor)
//        .fontSize(16)
//        .font('Helvetica-Bold')
//        .text(invoice.eventName, { align: 'center' });
    
//     doc.moveDown(0.5);

//     doc.fontSize(12).font('Helvetica');
    
//     const leftX = 50;
//     const rightX = 300;
    
//     const printRow = (label, value, y) => {
//         doc.font('Helvetica-Bold').text(label, leftX, y);
//         doc.font('Helvetica').text(value, rightX, y);
//     };

//     let currentY = 160;
//     printRow('Invoice Number:', invoice.invoiceNumber, currentY);
//     printRow('User:', `${user.firstName} ${user.lastName}`, currentY += 20);
//     printRow('Email:', user.email, currentY += 20);
//     printRow('Venue:', invoice.eventVenue, currentY += 20);
    
//     const formattedDate = invoice.eventDate.toLocaleString('en-US', { 
//         month: 'long', day: 'numeric', year: 'numeric'
//     });
//     printRow('Date:', formattedDate, currentY += 20);
//     printRow('Time:', invoice.eventTime.toLocaleTimeString('en-US', {
//         hour: 'numeric', minute: '2-digit', hour12: true
//     }), currentY += 20
//     );
//     printRow('Seats:', invoice.numberOfSeats.toString(), currentY += 20);
//     printRow('Status:', invoice.status, currentY += 20);
    
//     doc.moveDown();
//     doc.rect(50, currentY + 30, 500, 40).fillAndStroke('#f0f0f0', '#ccc');
//     doc.fillColor('#000').fontSize(14).font('Helvetica-Bold')
//        .text(`Total Amount: ${invoice.amount} * ${invoice.numberOfSeats} = Rs.${(invoice.amount * invoice.numberOfSeats).toFixed(2)}`, 60, currentY + 40);

       
   
//     doc.fontSize(10).fillColor('gray')
//        .text('Booking Date & Time:', 50, 750, { align: 'center', width: 500 })
//         .text(new Date().toLocaleString('en-US', {
//           month: 'long',
//           day: 'numeric',
//           year: 'numeric',
//           hour: 'numeric',
//           minute: '2-digit',
//           hour12: true
//         }), 50, 770, { align: 'center', width: 500 });


//     doc.end();
// }



module.exports = { handleBooking};
