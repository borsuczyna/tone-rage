import { registerFetchResolver } from './Hooks/Fetch.ts';
import { ChunkAssemblerHandler } from './Hooks/RageEventProvider.tsx';
import { mountRageEvents, mountRageInterface } from './Interface/Main.tsx';
import TextureService from './Services/TextureService.ts';

mountRageInterface();
mountRageEvents();
registerFetchResolver();
ChunkAssemblerHandler.init();
TextureService.init();