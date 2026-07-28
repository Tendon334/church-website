# Deploying bethesdamethodistmission.co.za

## 1. Register the domain (Afrihost)

1. Go to https://www.afrihost.com/domains and search **bethesdamethodistmission.co.za** (it was available as of 15 July 2026).
2. Add to cart, create/log in to your Afrihost account, and pay (~R90/year). Choose **domain only** — no hosting needed.

## 2. Publish the site (GitHub Pages)

1. Create a free account at https://github.com if you don't have one.
2. Create a new **public** repository, e.g. `church-website`.
3. Upload all files in this folder (including the `CNAME` file — it tells GitHub your domain).
4. In the repo: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.
5. Under **Custom domain**, confirm it shows `bethesdamethodistmission.co.za`, and tick **Enforce HTTPS** once available.

## 3. Point the domain to GitHub (Afrihost DNS)

In Afrihost ClientZone → Domains → Manage DNS, add:

| Type  | Host | Value               |
|-------|------|---------------------|
| A     | @    | 185.199.108.153     |
| A     | @    | 185.199.109.153     |
| A     | @    | 185.199.110.153     |
| A     | @    | 185.199.111.153     |
| CNAME | www  | tendon334.github.io |

GitHub repo: https://github.com/Tendon334/church-website

## 4. Wait and verify

DNS changes take up to 24h (usually under 1h). Then visit https://bethesdamethodistmission.co.za — done.

To update the site later, just edit the files in the GitHub repo.

## 5. Contact form — DONE (July 2026)

The contact form uses [Web3Forms](https://web3forms.com) (free, 250 msgs/month). The access key is installed in `contact.html`; messages go to sbumagc@gmail.com. Manage at https://app.web3forms.com (login: sbumagc@gmail.com via Google). To change the recipient: dashboard → form → Settings → Email Configuration.

## 6. Analytics — DONE (July 2026)

Cloudflare Web Analytics is installed on all pages (no cookies, POPIA-friendly). View traffic at https://dash.cloudflare.com → Web Analytics (login: sbumagc@gmail.com).

## 7. www subdomain — FIXED (28 July 2026)

The `www` CNAME record (managed at domains.co.za, not Afrihost) previously pointed at the apex domain, causing an SSL error on www. It now points to `tendon334.github.io`; GitHub auto-issues the www certificate and redirects www → apex. If www ever errors again, check the CNAME at domains.co.za → Manage Services → Domains → Manage → Edit DNS Records.
