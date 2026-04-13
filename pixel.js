/* Meta Pixel Code — loaded as external file to eliminate unsafe-inline */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '818615647986085');
fbq('track', 'PageView');

/* Event delegation: fire Contact event on any WhatsApp CTA click */
document.addEventListener('click', function(e){
  var el = e.target.closest('[data-fb-contact]');
  if(el) fbq('track', 'Contact');
});
