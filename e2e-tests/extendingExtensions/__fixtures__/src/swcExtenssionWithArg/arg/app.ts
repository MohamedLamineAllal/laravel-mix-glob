import { EventEmitter } from 'stream';

export default function App(): EventEmitter {
  return new EventEmitter();
}
