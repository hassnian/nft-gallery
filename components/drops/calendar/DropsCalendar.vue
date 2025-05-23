<template>
  <template v-if="Object.keys(grouppedDropCalendars ||{}).length">
    <hr
      class="my-14"
    >
    <h2 class="text-3xl font-semibold mb-7">
      {{ $t('drops.dropCalendar') }}
    </h2>

    <div class="flex flex-col gap-14">
      <div
        v-for="(grouppedDrop, label) in grouppedDropCalendars"
        :key="label"
      >
        <div class="mb-6 flex items-center">
          <NeoButton
            variant="secondary-rounded"
            root-class="shrink-0!"
            no-shadow
          >
            {{ label }}

            <tippy
              v-if="
                unscheduledDropCalendars?.length && label === unScheduledLabel
              "
              placement="right"
              :append-to="body"
            >
              <KIcon
                name="i-mdi:information-slab-circle"
                class="text-k-grey"
              />

              <template #content>
                <div class="w-[16rem] bg-background-color text-xs border p-4">
                  <p class="font-bold mb-2!">
                    {{ $t('drops.comingSoon') }}
                  </p>
                  <p>{{ $t('drops.calendarMoreDrops') }}</p>
                </div>
              </template>
            </tippy>
          </NeoButton>
          <hr class="w-full">
        </div>

        <DropsGrid
          :drops="grouppedDrop"
          :loaded="!pending"
          :default-skeleton-count="defaultSkeletonCount"
          skeleton-key="current-drops-skeleton"
        >
          <template #card="{ item }: { item: InternalDropCalendar }">
            <DropsBasicDropCard
              :name="item.name"
              :image="sanitizeIpfsUrl(item.items[0]?.image)"
              :drop-start-time="item.dropStartTime"
              :drop-status="DropStatus.SCHEDULED"
              :drop-max="item.supply as number"
              :time-tag-with-time="calendarHasTime(item)"
              :drop-prefix="item.chain"
              :drop-creator="item.creator"
              :drop-price="item.price"
              @click="() => handleClick(item)"
            >
              <template
                v-if="item.supply === null"
                #supply
              >
                <span class="text-k-grey">
                  {{ $t('helper.supplyNotSet') }}
                </span>
              </template>
            </DropsBasicDropCard>
          </template>
        </DropsGrid>
      </div>
    </div>

    <DropPreviewModal
      :drop-calendar="previewDropCalendar"
      @close="previewDropCalendar = undefined"
    />
  </template>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import type { Prefix } from '@kodadot1/static'
import { addMonths, format } from 'date-fns'
import groupBy from 'lodash/groupBy'
import DropPreviewModal from './DropPreviewModal.vue'
import type { DropCalendar } from '@/services/fxart'
import { getDropCalendar } from '@/services/fxart'
import { DropStatus } from '@/components/drops/useDrops'
import {
  dateHasTime,
  formatCETDate,
  parseCETDate,
} from '@/components/drops/utils'

export type InternalDropCalendar = DropCalendar & { dropStartTime: Date | null }

defineProps<{
  defaultSkeletonCount: number
}>()

const { urlPrefix } = usePrefix()

const dropCalendarChains: Prefix[] = ['ahp', 'base']

const { data, pending } = useAsyncData(
  () =>
    getDropCalendar({
      chain: !isProduction
        ? [...new Set([urlPrefix.value, ...dropCalendarChains])]
        : dropCalendarChains,
    }),
  {
    transform: (items) => {
      return items.map(item => ({
        ...item,
        dropStartTime: getDropStartTime(item),
      })) as InternalDropCalendar[]
    },
  },
)

const previewDropCalendar = ref<InternalDropCalendar>()
const body = ref(document.body)

const scheduledDropCalendars = computed(() =>
  data.value
    ?.filter(item => item.date && new Date(item.date).getTime() > Date.now())
    .sort(
      (a, b) =>
        new Date(a.date as string).getTime()
          - new Date(b.date as string).getTime(),
    ),
)

const unscheduledDropCalendars = computed(() =>
  data.value?.filter(item => !item.date),
)

const lastMonthDate = computed(() =>
  scheduledDropCalendars.value
    ?.map((x: DropCalendar) => new Date(x.date!))
    .reduce((oldest, current) => (current > oldest ? current : oldest)),
)

const unScheduledLabel = computed(() =>
  lastMonthDate.value
    ? `${format(addMonths(lastMonthDate.value, 1), 'MMMM')} +`
    : '',
)

const grouppedDropCalendars = computed(() => {
  const groupped = groupBy(scheduledDropCalendars.value, x =>
    formatDate(x.date!),
  )

  if (unscheduledDropCalendars.value?.length) {
    Object.assign(groupped, {
      [unScheduledLabel.value]: unscheduledDropCalendars.value,
    })
  }

  return groupped
})

const formatDate = (date: string) => format(new Date(date), 'dd. MMMM')

const calendarHasTime = (calendar: DropCalendar): boolean =>
  calendar.date ? dateHasTime(calendar.date) : Boolean(calendar.time)

const getCalendarParsedDate = ({
  date,
  time,
}: {
  date: string
  time: string | null
}): Date | null => {
  if (dateHasTime(date)) {
    return parseCETDate(date)
  }

  if (time) {
    const [dateDate] = date!.split(' ')
    return formatCETDate(dateDate, time)
  }

  return new Date(date)
}

const getDropStartTime = (calendar: DropCalendar): Date | null => {
  if (!calendar.date) {
    return null
  }

  return getCalendarParsedDate({ date: calendar.date, time: calendar.time })
}

const handleClick = (dropCalendar: InternalDropCalendar) => {
  previewDropCalendar.value = dropCalendar
}
</script>
