import Env, { registerAll } from './env';
import { teval } from './eval';
import { makeReader, read } from './read';

const env = new Env();
registerAll(env);

const reader = makeReader(`
(begin
  (let add-3 (fun (a b) (+ a b 3)))
  (add-3 1 2)
)`);
const expr = read(reader);
const result = teval(expr, env);
console.log(result.toString());
