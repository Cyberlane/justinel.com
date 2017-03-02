---
title: "Cloudflare Dynamic DNS"
github: "https://github.com/Cyberlane/Cloudflare-Dynamic-DNS"
img: "holder.js/150%x150/auto?random=yes"
---

I have my DNS running through Cloudflare, even the DNS entry which points to my computer at home. Unfortunately, my ISP does not provide dedicate IP addresses, but on the plus side, Cloudflare has a really good API for doing almost everything. So I created this simple NodeJS script which will update the sub-domain with my computer's public IP address.