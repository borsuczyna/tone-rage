import { registerFetchResolver } from './Hooks/Fetch.ts';
import { mountRageEvents, mountRageInterface } from './Interface/Main.tsx';

mountRageInterface();
mountRageEvents();
registerFetchResolver();