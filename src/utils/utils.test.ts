import { List } from "immutable";
import models from './models';

test("setGobangDefaultValue", () => {
    const b = models.setGobangDefaultValue()
    const a = List(b);
    // a[0][1] = '2';
    
    const c = a.set(0, ['1']);
    console.log(c.get(0));
    console.log(a.get(0));
    console.log(b);
    expect(1).toBe(1);
});
