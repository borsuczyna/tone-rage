import { registerFetchResolver } from './Hooks/Fetch.ts';
import { ChunkAssemblerHandler } from './Hooks/RageEventProvider.tsx';
import { mountRageEvents, mountRageInterface } from './Interface/Main.tsx';

mountRageInterface();
mountRageEvents();
registerFetchResolver();
ChunkAssemblerHandler.init();