<template>
  <o-steps
    v-model="activeStep"
    :rounded="rounded"
    :mobile-breakpoint="mobileBreakpoint"
    :has-navigation="hasNavigation"
    :style="{
      '--step-size': computedStepSize,
    }"
  >
    <slot />
  </o-steps>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'
import { OSteps } from '@oruga-ui/oruga-next'

const props = withDefaults(
  defineProps<{
    modelValue: number
    rounded?: boolean
    hasNavigation?: boolean
    stepSize?: string | number
    mobileBreakpoint?: string
  }>(),
  {
    rounded: true,
    hasNavigation: false,
    stepSize: '0.85rem',
    mobileBreakpoint: '0',
  },
)

const activeStep = useVModel(props, 'modelValue')

const computedStepSize = computed(() => {
  if (typeof props.stepSize === 'number') {
    return `${props.stepSize}px`
  }
  return props.stepSize
})
</script>

<style lang="scss">
@import './NeoSteps.scss';
</style>
