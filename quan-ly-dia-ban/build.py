"""Bundle the source into one offline HTML. Optional private input stays out of git."""
import argparse,json,pathlib
p=argparse.ArgumentParser();p.add_argument('--data');p.add_argument('--out',default='dist/dia-ban.html');a=p.parse_args()
root=pathlib.Path(__file__).resolve().parent
html=(root/'src/index.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+(root/'src/styles.css').read_text()+'</style>')
html=html.replace('<script defer src="model.js"></script>','').replace('<script defer src="app.js"></script>','')
js=(root/'src/model.js').read_text()+'\n'
if a.data:
 data=json.loads(pathlib.Path(a.data).read_text());js+='globalThis.DASHBOARD_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n'
js+=(root/'src/app.js').read_text()
html=html.replace('</body>','<script>'+js.replace('</script','<\\/script')+'</script></body>')
out=pathlib.Path(a.out);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html)
print(str(out.resolve()),out.stat().st_size,'bytes')
