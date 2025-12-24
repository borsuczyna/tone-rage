<script lang="ts">
  import { interfaceVisibility } from '../Hooks/InterfaceVisibilityStore';
  import NotificationsInterface from './Interfaces/NotificationsInterface.svelte';
  import AuthInterface from './Interfaces/AuthInterface.svelte';
  import SpawnSelectionInterface from './Interfaces/SpawnSelectionInterface.svelte';
  import HudInterface from './Interfaces/HudInterface.svelte';
  import ScoreboardInterface from './Interfaces/ScoreboardInterface.svelte';
  import HandlingEditorInterface from './Interfaces/HandlingEditorInterface.svelte';
  import AtmInterface from './Interfaces/AtmInterface.svelte';
  import MapDemoInterface from './Interfaces/MapDemoInterface.svelte';
  import TextureDebugInterface from './Interfaces/TextureDebugInterface.svelte';
  import ChatInterface from './Interfaces/ChatInterface.svelte';
  import WorldInteractionInterface from './Interfaces/WorldInteractionInterface.svelte';
  import CharacterCreatorInterface from './Interfaces/CharacterCreatorInterface.svelte';
  import TopsMakerInterface from './Interfaces/TopsMakerInterface.svelte';

  $: visibleInterfaces = $interfaceVisibility;
</script>

<div>
  {#if visibleInterfaces['HudInterface']}
    <HudInterface />
  {/if}
  {#if visibleInterfaces['NotificationsInterface']}
    <NotificationsInterface />
  {/if}
  {#if visibleInterfaces['AuthInterface']}
    <AuthInterface />
  {/if}
  {#if visibleInterfaces['SpawnSelectionInterface']}
    <SpawnSelectionInterface />
  {/if}
  {#if visibleInterfaces['ScoreboardInterface']}
    <ScoreboardInterface />
  {/if}
  {#if visibleInterfaces['HandlingEditorInterface']}
    <HandlingEditorInterface />
  {/if}
  {#if visibleInterfaces['AtmInterface']}
    <AtmInterface />
  {/if}
  {#if visibleInterfaces['MapDemoInterface']}
    <MapDemoInterface />
  {/if}
  {#if visibleInterfaces['TextureDebugInterface']}
    <TextureDebugInterface />
  {/if}
  {#if visibleInterfaces['ChatInterface']}
    <ChatInterface />
  {/if}
  {#if visibleInterfaces['WorldInteractionInterface']}
    <WorldInteractionInterface />
  {/if}
  {#if visibleInterfaces['CharacterCreatorInterface']}
    <CharacterCreatorInterface />
  {/if}
  {#if visibleInterfaces['TopsMakerInterface']}
    <TopsMakerInterface />
  {/if}
</div>
