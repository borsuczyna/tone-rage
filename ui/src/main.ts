import { registerFetchResolver } from './Hooks/Fetch.ts';
import { ChunkAssemblerHandler } from './Hooks/RageEventProvider.ts';
import { mountRageInterface, mountRageEvents } from './Interface/Main.ts';
import TextureService from './Services/TextureService.ts';

mountRageInterface();
mountRageEvents();
registerFetchResolver();
ChunkAssemblerHandler.init();
TextureService.init();
