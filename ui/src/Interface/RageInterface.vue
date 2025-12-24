<template>
  <div>
    <HudInterface v-if="isInterfaceVisible('HudInterface')" />
    <NotificationsInterface v-if="isInterfaceVisible('NotificationsInterface')" />
    <AuthInterface v-if="isInterfaceVisible('AuthInterface')" />
    <SpawnSelectionInterface v-if="isInterfaceVisible('SpawnSelectionInterface')" />
    <ScoreboardInterface v-if="isInterfaceVisible('ScoreboardInterface')" />
    <HandlingEditorInterface v-if="isInterfaceVisible('HandlingEditorInterface')" />
    <AtmInterface v-if="isInterfaceVisible('AtmInterface')" />
    <MapDemoInterface v-if="isInterfaceVisible('MapDemoInterface')" />
    <TextureDebugInterface v-if="isInterfaceVisible('TextureDebugInterface')" />
    <ChatInterface v-if="isInterfaceVisible('ChatInterface')" />
    <WorldInteractionInterface v-if="isInterfaceVisible('WorldInteractionInterface')" />
    <CharacterCreatorInterface v-if="isInterfaceVisible('CharacterCreatorInterface')" />
    <TopsMakerInterface v-if="isInterfaceVisible('TopsMakerInterface')" />
  </div>
</template>

<script setup lang="ts">
import { useInterfaceVisibility } from '../Hooks/InterfaceVisibilityProvider';
import NotificationsInterface from './Interfaces/NotificationsInterface.vue';
import AuthInterface from './Interfaces/AuthInterface.vue';
import SpawnSelectionInterface from './Interfaces/SpawnSelectionInterface.vue';
import HudInterface from './Interfaces/HudInterface.vue';
import ScoreboardInterface from './Interfaces/ScoreboardInterface.vue';
import HandlingEditorInterface from './Interfaces/HandlingEditorInterface.vue';
import AtmInterface from './Interfaces/AtmInterface.vue';
import MapDemoInterface from './Interfaces/MapDemoInterface.vue';
import TextureDebugInterface from './Interfaces/TextureDebugInterface.vue';
import ChatInterface from './Interfaces/ChatInterface.vue';
import WorldInteractionInterface from './Interfaces/WorldInteractionInterface.vue';
import CharacterCreatorInterface from './Interfaces/CharacterCreatorInterface.vue';
import TopsMakerInterface from './Interfaces/TopsMakerInterface.vue';

const { isInterfaceVisible } = useInterfaceVisibility();
</script>
