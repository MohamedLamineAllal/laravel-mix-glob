import module1f from './modules/Module1/module1';
import module2f from './modules/module2';

export default function core_f() {
  console.log('Hallo core');
  module1f();
  module2f();
}
