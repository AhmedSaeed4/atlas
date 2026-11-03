import {test,expect} from '@playwright/test';

for(const path of ['help','privacy','terms']){
  test(`${path} is readable without JavaScript, with working contents and contact links`,async({browser,baseURL,request})=>{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();
    try{
      await page.goto(baseURL+'/'+path);await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#page-startup')).toHaveCount(0);
      const contents=page.getByRole('navigation',{name:'On this page'});
      const links=contents.locator('a');expect(await links.count()).toBeGreaterThan(5);
      for(const href of await links.evaluateAll(links=>links.map(link=>link.getAttribute('href'))))await expect(page.locator(href)).toHaveCount(1);
      await links.last().click();
      await expect(page.locator('.support-article a[href="mailto:mizuedit3@gmail.com"]').last()).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await expect(page.getByRole('navigation',{name:'Help and legal'}).getByRole('link')).toHaveCount(3);
      if(path==='help'){
        await page.goto(baseURL+'/help#troubleshooting');
        await page.locator('.support-faq summary').first().click();
        await expect(page.locator('.support-faq').first()).toHaveAttribute('open','');
      }
    }finally{await context.close();}
    const redirect=await request.get('/'+path+'/?keep=1',{maxRedirects:0});
    expect(redirect.status()).toBe(308);expect(redirect.headers().location).toBe('/'+path+'?keep=1');
    expect((await request.get('/'+path+'.html')).status()).toBe(200);
  });
}

test('support pages share the theme and do not initialize cloud or request remote assets',async({page})=>{
  const remote=[];page.on('request',request=>{if(new URL(request.url()).origin!==new URL(page.url()==='about:blank'?'http://127.0.0.1:4199':page.url()).origin)remote.push(request.url());});
  for(const path of ['help','privacy','terms']){
    await page.goto('/'+path);await expect(page.locator('html')).toHaveAttribute('data-startup-state','ready');
    await page.locator('#theme-toggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
    await page.locator('#theme-toggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  }
  expect(remote).toEqual([]);
});
