<template>
  <transition name="fade">
    <NeoUpload
      v-model="selectedFile"
      drag-drop
      native
      expanded
      accept=".zip"
      @update:model-value="handleFileSelected"
    >
      <template v-if="!selectedFile">
        <div class="flex flex-col items-center limit-width gap-2 py-5">
          <KIcon
            name="i-mdi:folder-upload-outline"
            class="text-xl text-k-grey"
          />
          <span>Drag Your <b class="mr-1">.Zip File</b> Here Or Click To
            Select</span>
          <span class="text-k-grey">{{
            $t('codeChecker.supportedFormats')
          }}</span>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4 overflow-hidden">
            <KIcon
              name="i-mdi:code-block-tags"
              class="border py-3 px-[10px] rounded-full text-k-grey"
            />
            <span class="text-ellipsis overflow-hidden">{{
              fileName ?? selectedFile.name
            }}</span>
          </div>
          <NeoButton
            class="text-neutral-7"
            variant="text"
            no-shadow
            icon="xmark"
            size="medium"
            @click="clearSelection"
          />
        </div>
      </template>
    </NeoUpload>
  </transition>
</template>

<script lang="ts" setup>
import { NeoButton, NeoUpload } from '@kodadot1/brick'

const emits = defineEmits(['update:selectedFile', 'fileSelected', 'clear'])

defineProps<{
  fileName?: string
}>()

const selectedFile = ref<File | null>(null)

const handleFileSelected = (file: File | null) => {
  selectedFile.value = file
  if (file) {
    emits('fileSelected', file)
  }
  emits('update:selectedFile', file)
}

const clearSelection = () => {
  selectedFile.value = null
  emits('clear')
}
</script>
