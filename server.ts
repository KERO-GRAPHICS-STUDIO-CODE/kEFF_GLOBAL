import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_key");
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://example.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "service_role_key"
);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // We need raw body for Paystack signature verification
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  // Paystack Webhooks / API
  app.post("/api/payments/webhook", async (req: any, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY || "sk_test_demo";
    const hash = crypto.createHmac('sha512', secret).update(req.rawBody).digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;

      console.log("Paystack Webhook received:", event.event);

      if (event.event === 'charge.success') {
        const metadata = event.data.metadata;

        let orderId = "";
        let buyerId = "";
        let sellerId = "";

        if (metadata && metadata.custom_fields) {
          const orderField = metadata.custom_fields.find((f: any) => f.variable_name === 'order_id');
          const buyerField = metadata.custom_fields.find((f: any) => f.variable_name === 'buyer_id');
          const sellerField = metadata.custom_fields.find((f: any) => f.variable_name === 'seller_id');

          orderId = orderField ? orderField.value : "";
          buyerId = buyerField ? buyerField.value : "";
          sellerId = sellerField ? sellerField.value : "";
        }

        if (orderId) {
          // Update order status in Supabase
          const { error: orderError } = await supabase
            .from('orders')
            .update({ status: 'Payment Secured' })
            .eq('id', orderId);

          if (orderError) console.error("Error updating order:", orderError);

          // Log notifications
          await supabase.from('notifications').insert([
            { user_id: buyerId, message: `Your payment for order ${orderId} has been secured in escrow.`, type: 'payment_success' },
            { user_id: sellerId, message: `Payment for order ${orderId} has been successfully secured in escrow. Please process the package.`, type: 'payment_secured' }
          ]);

          // Send emails via Resend
          const buyerEmail = event.data.customer.email;
          const sellerEmail = "seller@example.com"; // In real app, fetch seller email from DB

          try {
            await resend.emails.send({
              from: 'RiVuG <admin@rivug.store>',
              to: [buyerEmail],
              subject: 'Payment Secured in Escrow',
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #4f46e5;">Payment Successful</h2>
                  <p>Your payment of ${event.data.amount / 100} NGN for order ${orderId} was successful.</p>
                  <p>Your funds are held securely in our escrow until you confirm receipt.</p>
                  <p>Thank you for using RiVuG.</p>
                </div>
              `
            });

            await resend.emails.send({
              from: 'RiVuG <admin@rivug.store>',
              to: [sellerEmail],
              subject: 'Action Required: Payment Secured',
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #eab308;">Payment Secured</h2>
                  <p>Great news! The payment for order ${orderId} has been successfully secured in our escrow.</p>
                  <p><strong>Action Required:</strong> Please begin processing the buyer's package immediately.</p>
                  <p>Funds will be released to you upon buyer confirmation.</p>
                </div>
              `
            });
            console.log("Emails sent successfully");
          } catch (emailErr) {
            console.error("Error sending emails:", emailErr);
          }
        }
      }
      res.status(200).send("OK");
    } else {
      res.status(400).send("Invalid signature");
    }
  });

  app.post("/api/payments/initiate-escrow", (req, res) => {
    // Logic to initiate escrow via Paystack
    res.json({ message: "Escrow initiated" });
  });

  // Socket.io Chat Logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", (data) => {
      // data: { roomId, senderId, text, timestamp }
      io.to(data.roomId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // This custom Express server does not own Vite's upgrade handler.
        // Disable the client HMR socket so the preview does not retry a socket
        // that can never be opened through the middleware-only setup.
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`KUFF GLOBAL Server running on http://localhost:${PORT}`);
  });
}

startServer();
