import { connectDB } from '@/lib/db';
import { humanReadableDate } from './../../../functions/utility';
import { transporter } from '@/lib/nodemailer';

export async function POST(request: Request) {
  await connectDB();

  try {
    const data = await request.json();
    const mailOptions = {
      from: {
        name: `Booking Request - ${data.hotel}`,
        address: data.email || 'booking@insurhotels.com'
      },
      to: 'contact@divinely.dev',
      subject: `Booking Request from ${data.name} - ${data.hotel}`,
      html: `
      <table style="height: 49px; margin-left: auto; margin-right: auto;" width="466">
   <tbody>
      <tr>
         <td style="width: 225px;"><strong>Hotel</strong></td>
         <td style="width: 225px;">${data.hotel}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Name</strong></td>
         <td style="width: 225px;">${data.name}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Email</strong></td>
         <td style="width: 225px;">${data.email}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Phone</strong></td>
         <td style="width: 225px;">+91${data.phone}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Check In</strong></td>
         <td style="width: 225px;">${humanReadableDate(data.checkIn)}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Check Out</strong></td>
         <td style="width: 225px;">${humanReadableDate(data.checkOut)}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Guests</strong></td>
         <td style="width: 225px;">${data.guests}</td>
      </tr>
      <tr>
         <td style="width: 225px;"><strong>Rooms</strong></td>
         <td style="width: 225px;">${data.rooms}</td>
      </tr>
   </tbody>
</table>
      `
    };

    await transporter.sendMail(mailOptions);
    return new Response('Message sent!', { status: 200 });
  } catch (error) {
    return new Response('Error sending message', { status: 500 });
  }
}
