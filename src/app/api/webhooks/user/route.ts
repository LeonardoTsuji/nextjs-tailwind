import type { IncomingHttpHeaders } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookRequiredHeaders } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import api from '@/utils/http';

const webhookSecret: string = process.env.WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixIdTimeStamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    return new Response('Error occured', {
      status: 400,
    });
  }
  // Create an object of the headers
  const svixHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixIdTimeStamp,
    'svix-signature': svixSignature,
  };
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (_) {
    console.log('error');
    return new Response('Error occured', {
      status: 400,
    });
  }
  const { id } = evt.data;
  // Handle the webhook
  const eventType = evt.type;
  if (eventType === 'user.created') {
    await api.post('/usuario', {
      login: evt.data.email_addresses[0].email_address,
      nome: evt.data.first_name + ' ' + evt.data.last_name,
      cpf: evt.data.unsafe_metadata.cpf,
      idExterno: evt.data.id,
    });
  }
  return new Response('', {
    status: 201,
  });
}
