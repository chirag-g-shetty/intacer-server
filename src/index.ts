import {Hono} from 'hono'
import {cors} from "hono/cors";
import edu from "./genAI";

const server = new Hono()
server
    .use(cors())
    .get('/', (ctx) => {
        return ctx.json({'status': 'OK'})
    })
    .post('/gen',async (ctx) => {
      const clientRes = await ctx.req.json()
      const {p1,p2,f} = clientRes;
      const ans:any = await edu(p1,p2,f)
      return ctx.json(ans)
    })

export default server
