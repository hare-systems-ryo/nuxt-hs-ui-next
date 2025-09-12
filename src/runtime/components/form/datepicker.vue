<script setup lang="ts">
/* ----------------------------------------------------------------------------
// src\runtime\components\form\datepicker.vue
// ----------------------------------------------------------------------------
// FormDatepicker
// FormDatepickerFormDatepicker
---------------------------------------------------------------------------- */

// [ node-modules ]
import { type DateValue, fromDate, toCalendarDate, getLocalTimeZone } from '@internationalized/date';

// [ NUXT ]
import { reactive, ref, watch, computed, useId, onMounted, nextTick, shallowRef } from '#imports';
// [ utils ]
import type { ClassType } from '../../utils/class-style';
import { GetTimeShiftValue, Dayjs, DayjsInit } from '../../utils/dayjs';
import type { MultiLang } from '../../utils/multi-lang';
import { dayjs } from '../../utils/dayjs';
import { Theme, type ThemeColor, GetColorCode } from '../../utils/theme';

// [ composables ]
import { useHsFocus } from '../../composables/use-hs-focus';
import { useHsToast } from '../../composables/use-hs-toast';
import { useHsMultiLang } from '../../composables/use-hs-multi-lang';
import { useHsPinia } from '../../composables/use-pinia';
import { useHsIsMobile } from '../../composables/use-hs-is-mobile';
// [ Components ]
import InputFrame from './input-frame.vue';
// ----------------------------------------------------------------------------
// [ nac-stroe ]
DayjsInit();
const hsFocus = useHsFocus(useHsPinia());
const Toast = useHsToast(useHsPinia());
const multiLang = useHsMultiLang(useHsPinia());
const tx = multiLang.tx;
const hsIsMobile = useHsIsMobile(useHsPinia());
onMounted(() => {
  hsIsMobile.init();
});
// ----------------------------------------------------------------------------
// flatpickr
const timeOutputDateFormat = 'HH:mm:ss.SSS';
const timeShowDateFormat = 'HH:mm';
const timeDateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
// ----------------------------------------------------------------------------
// [ Props ]
type Props = {
  theme?: ThemeColor;
  // ----------------------------------------------------------------------------
  // Input 種類別
  textAlign?: 'left' | 'center' | 'right';
  mode?: 'all' | 'date' | 'time';
  /** mode=time の場合、[HH:mm:ss.SSS] に固定 */
  dataFormat?: string;
  /** mode=time の場合、[HH:mm] に固定 */
  showFormat?: string;
  minDate?: string | null;
  maxDate?: string | null;
  hideDeleteBtn?: boolean;
  hideTodayBtn?: boolean;
  disableMobile?: boolean;
  hasShift?: boolean;
  /** 言語設定
   * * 例 'ja-JP'  'en-US'" */
  locale?: string | undefined;
  portal?: string | false | true | HTMLElement;
  // ----------------------------------------------------------------------------
  data: string | null;
  diff?: string | null | undefined;
  tabindex?: string | undefined;
  // ----------------------------------------------------------------------------
  class?: ClassType;
  classHeader?: ClassType;
  classInput?: ClassType;
  // ----------------------------------------------------------------------------
  // 状態
  focusColor?: string;
  changeColor?: string;
  error?: boolean;
  errorColor?: string;
  disabled?: boolean;
  disabledColor?: string;
  readonly?: boolean;
  headerless?: boolean;
  // ----------------------------------------------------------------------------
  // 表示
  label?: MultiLang;
  // 表示-副情報
  require?: boolean;
  requireText?: MultiLang;
  warn?: string;
  warnTimeOut?: number;
  // ----------------------------------------------------------------------------
  // 設定
  size?: 's' | 'm' | 'l';
  // ----------------------------------------------------------------------------
  uiText?: {
    error: {
      inputRangeTitle: MultiLang;
      inputRangeMessage: MultiLang;
    };
  };
};

const props = withDefaults(defineProps<Props>(), {
  // ----------------------------------------------------------------------------
  // Input 種類別
  textAlign: 'left',
  mode: 'date',
  dataFormat: '',
  showFormat: '',
  minDate: null,
  maxDate: null,
  hideDeleteBtn: false,
  disableMobile: false,
  hasShift: true,
  locale: undefined,
  theme: Theme.accent1,
  portal: true,
  // ----------------------------------------------------------------------------
  diff: undefined,
  tabindex: undefined,
  // ----------------------------------------------------------------------------
  class: '',
  classHeader: '',
  classInput: '',
  // ----------------------------------------------------------------------------
  // 状態
  //   focus: false,
  focusColor: 'shadow-[inset_0px_0px_1px_2px_#0d8ee4]',
  //   change: false,
  changeColor: 'shadow-[inset_0px_0px_1px_2px_#fd9831be]',
  error: false,
  errorColor: 'shadow-[inset_0px_0px_1px_2px_#d80000dc]',
  disabled: false,
  disabledColor: '',
  readonly: false,
  headerless: false,
  // ----------------------------------------------------------------------------
  // 表示
  label: '',
  // 表示-副情報
  require: false,
  requireText: () => ({ ja: '必須', en: 'Required' }),
  warn: '',
  warnTimeOut: 3000,
  // ----------------------------------------------------------------------------
  // 設定
  size: 'm',
  // ----------------------------------------------------------------------------
  uiText: () => {
    return {
      error: {
        inputRangeTitle: { ja: '入力値の警告', en: 'Input Value Warning' },
        inputRangeMessage: {
          ja: '入力範囲外です',
          en: 'Input is out of range',
        },
      },
    };
  },
});
// [ emit ]
type Emits = {
  ref: [element: HTMLElement];
  focus: [elm: HTMLElement];
  blur: [elm: HTMLElement];
  // ----------------------------
  'update:data': [value: string | null];
  'value-change': [after: string | null, before: string | null];
  // ----------------------------
  'reset-piceker-func': [func: any];
  // ----------------------------
};
const emit = defineEmits<Emits>();
// ----------------------------------------------------------------------------
const themeColor = computed(() => {
  return GetColorCode(props.theme);
});
// ----------------------------------------------------------------------------
const themeWeekColor = computed(() => {
  return GetColorCode(Theme.main1);
});

// ----------------------------------------------------------------------------
const themeErrorColor = computed(() => {
  return GetColorCode(Theme.error);
});

// ----------------------------------------------------------------------------
const slots = defineSlots<{
  default(props: { msg: string }): any;
  overlay?(): any;
  'right-icons'?(): any;
  'left-icons'?(): any;
}>();
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// [ getCurrentInstance ]
const uid = useId();
// ----------------------------------------------------------------------------
// 現在の表示系
const shiftM = GetTimeShiftValue(Dayjs());
const getShiftDayjs = (date: any) => {
  if (props.hasShift && shiftM !== 0) {
    return dayjs().subtract(shiftM, 'minute');
  }
  return dayjs(date);
};
// ----------------------------------------------------------------------------
const dataDasyjs = computed(() => {
  const lang = multiLang.lang;
  dayjs.locale(lang);
  if (props.data === null) {
    return null;
  } else if (props.mode === 'time') {
    return getShiftDayjs(dayjs().format('YYYY-MM-DD ') + props.data);
  } else {
    return getShiftDayjs(props.data);
  }
});
const minDayjs = computed(() => {
  if (props.minDate === null) {
    return null;
  } else if (props.mode === 'time') {
    return getShiftDayjs(dayjs().format('YYYY-MM-DD ') + props.minDate);
  } else {
    return getShiftDayjs(props.minDate);
  }
});
const maxDayjs = computed(() => {
  if (props.maxDate === null) {
    return null;
  } else if (props.mode === 'time') {
    return getShiftDayjs(dayjs().format('YYYY-MM-DD ') + props.maxDate);
  } else {
    return getShiftDayjs(props.maxDate);
  }
});
// ----------------------------------------------------------------------------

const displayText = computed(() => {
  if (dataDasyjs.value === null) {
    return '';
  } else if (props.mode === 'time') {
    return dataDasyjs.value.format(timeShowDateFormat);
  } else {
    return dataDasyjs.value.format(props.showFormat);
  }
});

// ----------------------------------------------------------------------------
// データ更新系
const checkDate = (date: any) => {
  // console.log(props.minDate);
  const d = getShiftDayjs(date);
  if (props.minDate !== '' && d.isBefore(props.minDate)) {
    // console.log('最小日付を下回っています', props.data, props.minDate);
    return false;
  } else if (props.maxDate !== '' && d.isAfter(props.maxDate)) {
    // console.log('最大日付を下回っています', props.data, props.maxDate);
    return false;
  }
  return true;
};

const updateValue = async (text: string | null) => {
  // console.log('updateValue', text);
  const before = props.data;
  if (text === null || text.length === 0) {
    emit('update:data', null);
    await nextTick();
    emit('value-change', null, before);
    return;
  }
  if (props.mode === 'all' || props.mode === 'date') {
    const d = getShiftDayjs(dayjs(text));
    if (checkDate(d.format('YYYY-MM-DD')) === false) {
      Toast.Warning(props.uiText.error.inputRangeMessage, props.uiText.error.inputRangeTitle, props.warnTimeOut);
      return;
    }
  }
  if (props.mode === 'all') {
    emit('update:data', dayjs(text).format(props.dataFormat));
    nextTick(() => {
      emit('value-change', dayjs(text).format(props.dataFormat), before);
    });
  } else if (props.mode === 'time') {
    emit('update:data', dayjs(text).format(timeOutputDateFormat));
    nextTick(() => {
      emit('value-change', dayjs(text).format(timeOutputDateFormat), before);
    });
  } else {
    // 時間情報を削除する
    emit('update:data', dayjs(dayjs(text).format('YYYY-MM-DD')).format(props.dataFormat));
    nextTick(() => {
      emit('value-change', dayjs(dayjs(text).format('YYYY-MM-DD')).format(props.dataFormat), before);
    });
  }
};

const datePickerToday = () => {
  if (props.readonly === true) return;
  if (props.disabled === true) return;
  //   if (state.date !== null) return;
  const inputValue = dayjs();

  const d = getShiftDayjs(inputValue);
  if (checkDate(d.format('YYYY-MM-DD')) === false) {
    Toast.Warning(props.uiText.error.inputRangeMessage, props.uiText.error.inputRangeTitle, props.warnTimeOut);
    return;
  }
  // console.log(inputValue.format(''));
  updateValue(inputValue.format(''));
};

const inputBoxClass = computed(() => {
  if (props.textAlign === 'left') {
    return 'display-left';
  } else if (props.textAlign === 'center') {
    return 'display-center';
  } else {
    return 'display-right';
  }
});

const iconEventDelete = () => {
  const before = props.data;
  if (props.readonly === true) return;
  if (props.disabled === true) return;
  emit('update:data', null);
  nextTick(() => {
    emit('value-change', null, before);
  });
};

// [ ref ]
const inputElement = ref();
onMounted(() => {
  emit('ref', inputElement.value as HTMLInputElement);
});

const tabindex = computed(() => {
  if (props.disabled === true) return -1;
  return props.tabindex;
});

// 更新の有無判定
const isChangeData = computed(() => {
  if (props.diff === undefined) return false;
  if (props.diff === null && props.data === '') return false;
  if (props.diff === '' && props.data === null) return false;
  if (props.diff !== props.data) return true;
  return false;
});

//  ---------------------------------------------------------------------------------
// カレンダーモーダル制御
const open = ref(false);
// Popupの表示位置のターゲット
const openBtn = ref<HTMLElement | null>();
// 表示中カレンダーの値
const calendarValue = shallowRef<DateValue | null>(null);
const displayLocale = computed(() => {
  if (props.locale) return props.locale;
  return multiLang.lang === 'ja' ? 'ja-JP' : 'en-US';
});
//  -------------------------------------------------
const calendarMinValue = computed(() => {
  if (!minDayjs.value) return null;
  return toCalendarDate(fromDate(minDayjs.value.toDate(), getLocalTimeZone()));
});
const calendarMaxValue = computed(() => {
  if (!maxDayjs.value) return null;
  return toCalendarDate(fromDate(maxDayjs.value.toDate(), getLocalTimeZone()));
});
//  -------------------------------------------------
const HH = shallowRef<string | null>(null);
const MM = shallowRef<string | null>(null);
//  -------------------------------------------------
const listHH = Array.from({ length: 23 })
  .fill(null)
  .map((row, index) => {
    return `${index + 1 < 10 ? `0${index + 1}` : index + 1}`;
  });

const listMM = Array.from({ length: 59 })
  .fill(null)
  .map((row, index) => {
    return `${index + 1 < 10 ? `0${index + 1}` : index + 1}`;
  });
//  -------------------------------------------------

const toggleModal = () => {
  if (props.readonly) return;
  if (props.disabled) return;
  const openState = !open.value;

  if (openState) {
    hsFocus.state.id = uid;
    if (dataDasyjs.value !== null) {
      if (props.mode !== 'time') {
        const calDate = toCalendarDate(fromDate(dataDasyjs.value.toDate(), getLocalTimeZone()));
        calendarValue.value = calDate;
      }
      if (props.mode === 'all' || props.mode === 'time') {
        // const calDate = toCalendarDate(fromDate(displayTs.value.toDate(), getLocalTimeZone()));
        HH.value = dataDasyjs.value.format('HH');
        MM.value = dataDasyjs.value.format('mm');
      } else {
        HH.value = null;
        MM.value = null;
      }
    } else {
      calendarValue.value = null;
      HH.value = null;
      MM.value = null;
    }
  }
  open.value = openState;
};
function toJSDate(v: DateValue, tz: string): Date {
  return 'timeZone' in v || 'offset' in v ? (v as any).toDate() : (v as any).toDate(tz);
}

const changeCalender = (date: DateValue | null) => {
  const TZ = getLocalTimeZone();
  // console.log('changeCalender', { date, TZ });
  const t = date ? Dayjs(toJSDate(date, TZ)).tz(TZ) : null;
  if (!t) {
    calendarValue.value = null;
    updateValue(null);
    return;
  }
  if (props.mode === 'all' || props.mode === 'time') {
    // console.log('changeCalender', { date, TZ }, t.format('YYYY-MM-DD') + ` ${HH.value || '00'}:${MM.value || '00'}`);
    // const calDate = toCalendarDate(fromDate(displayTs.value.toDate(), getLocalTimeZone()));
    updateValue(t.format('YYYY-MM-DD') + ` ${HH.value || '00'}:${MM.value || '00'}`);
  } else {
    updateValue(t.format(''));
  }
  calendarValue.value = date;
};

//  -------------------------------------------------
const hhValueChange = (value: string) => {
  //
  if (/^[0-5]\d$/.test(value)) {
    HH.value = value;
    if (!MM.value) MM.value = '00';
    if (!calendarValue.value) {
      calendarValue.value = toCalendarDate(fromDate(new Date(), getLocalTimeZone()));
    }
  } else {
    HH.value = null;
    MM.value = null;
    calendarValue.value = null;
  }
  changeCalender(calendarValue.value);
};
const mmValueChange = (value: string) => {
  //
  if (/^(?:[01]\d|2[0-3])$/.test(value)) {
    MM.value = value;
    if (!HH.value) HH.value = '00';
    if (!calendarValue.value) {
      calendarValue.value = toCalendarDate(fromDate(new Date(), getLocalTimeZone()));
    }
  } else {
    HH.value = null;
    MM.value = null;
    calendarValue.value = null;
  }
  changeCalender(calendarValue.value);
};
//  ---------------------------------------------------------------------------------

interface FocusState {
  isOpenFlatpickr: boolean;
  isClosingFlatpickr: boolean;
  manualInput: boolean;
  openBtn: boolean;
}

const focusState = reactive<FocusState>({
  isOpenFlatpickr: false,
  isClosingFlatpickr: false,
  manualInput: false,
  openBtn: false,
});

/**
 * コントロールのFocus判定
 */
const computedActivate = computed(() => {
  if (props.disabled === true) return false;
  if (props.readonly === true) return false;
  if (hsFocus.state.id !== uid) return false;
  if (open.value === true) return true;
  if (focusState.isOpenFlatpickr) return true;
  if (focusState.manualInput) return true;
  if (focusState.openBtn) return true;
  return false;
});
watch(
  () => hsFocus.state.id,
  () => {
    open.value = false;
  }
);

/**
 * focus, blur イベント
 */
watch(computedActivate, (value) => {
  if (value === true) {
    // クリックでの遷移の場合に
    // 一つ前のコントロールのblurイベントよりも早くfocusが発生しないようにする対策で10ミリ秒処理をずらす
    setTimeout(() => {
      emit('focus', inputElement.value);
    }, 10);
  } else {
    emit('blur', inputElement.value);
  }
});
const openBtnFocus = () => {
  if (props.readonly) return;
  if (props.disabled) return;
  hsFocus.state.id = uid;
  focusState.openBtn = true;
};
//  ---------------------------------------------------------------------------------
const manualElm = ref<HTMLInputElement | null>();
const manualData = ref('');
const manualInput = ref(false);
const manualInputClick = () => {
  if (props.readonly) return;
  if (props.disabled) return;
  if (hsIsMobile.isMobile) {
    toggleModal();
    return;
  }
  manualInput.value = true;
  manualElm.value?.focus();
};

const manualInputfocus = () => {
  if (props.readonly) return;
  if (props.disabled) return;
  manualData.value = displayText.value;
  focusState.openBtn = false;
  setTimeout(() => {
    manualElm.value?.select();
    hsFocus.state.id = uid;
    focusState.manualInput = true;
  }, 1);
};
const manualInputBlur = () => {
  if (props.readonly) return;
  if (props.disabled) return;
  const TZ = getLocalTimeZone();
  try {
    if (props.mode === 'all' || props.mode === 'date') {
      const d = dayjs(manualData.value, props.showFormat, true);
      if (!d.isValid()) {
        updateValue(null);
        return;
      }
      updateValue(d.tz(TZ).format(props.dataFormat));
    } else if (props.mode === 'time') {
      const inputValue = manualData.value.replace(/[-:]/g, '').replace(/(\d{2})(\d{2})/, '$1:$2');
      const nowDt = dayjs().format('YYYY-MM-DD');
      const d = dayjs(nowDt + ' ' + inputValue, timeDateFormat, true);
      if (!d.isValid()) {
        updateValue(null);
        return;
      }
      updateValue(d.tz(TZ).format(timeDateFormat));
    }
  } catch (err) {
    console.error('manualInputBlur', err);
  } finally {
    manualData.value = '';
    manualInput.value = false;
    focusState.manualInput = false;
  }
};

//  ---------------------------------------------------------------------------------

const computedIsFocusOpenBtn = computed(() => {
  if (props.disabled === true) return false;
  if (props.readonly === true) return false;
  if (hsFocus.state.id !== uid) return false;
  if (focusState.isOpenFlatpickr) return true;
  if (focusState.openBtn) return true;
  return false;
});

const KEEP_OPEN_SELECTOR = '[data-keep-popover-open]';
// Nuxt UI UPopover用
const content = {
  align: 'start',
  sideOffset: 8,
  onPointerDownOutside: (e: any) => {
    const t = e.target as HTMLElement;
    // console.log('onFocusOutside', t);
    if (t.closest(KEEP_OPEN_SELECTOR)) {
      e.preventDefault(); // ← このクリックでは閉じない
    }
  },
  onFocusOutside: (e: any) => {
    const t = e.target as HTMLElement;
    // console.log('onFocusOutside', t);
    if (t.closest(KEEP_OPEN_SELECTOR)) e.preventDefault();
  },
};

const posTarget = ref();
//  ---------------------------------------------------------------------------------
</script>

<template>
  <InputFrame
    v-bind="$attrs"
    :class="['HsDatePicker', props.class]"
    :class-header="props.classHeader"
    :class-input="[props.classInput]"
    :focus="computedActivate"
    :focus-color="props.focusColor"
    :change="isChangeData"
    :change-color="props.changeColor"
    :error="props.error"
    :error-color="props.errorColor"
    :disabled="props.disabled"
    :disabled-color="props.disabledColor"
    :readonly="props.readonly"
    :label="props.label"
    :require="props.require"
    :require-text="tx(props.requireText).value"
    :warn="props.warn"
    :warn-time-out="props.warnTimeOut"
    :size="props.size"
    :headerless="props.headerless"
    @ref="(e) => (posTarget = e)"
  >
    <template v-if="slots.overlay" #overlay>
      <slot name="overlay"></slot>
    </template>
    <template v-if="!props.readonly" #left-icons>
      <slot name="left-icons" :disabled="disabled" />
      <!-- <UButton label="" color="neutral" variant="subtle" /> -->

      <button
        ref="openBtn"
        data-sep="right"
        data-icon="calendar"
        :tabindex="tabindex"
        :disabled="disabled"
        class="open-btn"
        :class="!disabled ? 'cursor-pointer hover:bg-accent1/[0.1] active:bg-accent1/[0.2]' : ''"
        data-keep-popover-open
        @focus="openBtnFocus"
        @blur="focusState.openBtn = false"
        @click.stop="toggleModal"
      >
        <!-- @click.stop="toggleModal" -->
        <!-- -->
        <!---->

        <!-- -->
        <!--  -->
        <!-- @click.stop="datePickerToggle()" -->

        <div
          class="absolute inset-[4px] border-main2 border pointer-events-none transition-all rounded-sm"
          :class="computedIsFocusOpenBtn ? 'opacity-100' : 'opacity-0'"
        ></div>
        <i :class="props.mode === 'time' ? 'fa-regular fa-clock' : 'fa-solid fa-calendar-days'"></i>
      </button>
    </template>
    <div
      class="nac-c-input-p relative min-h-[20px]"
      :class="[{ disabled: props.disabled, readonly: props.readonly }, inputBoxClass]"
      @click.stop="manualInputClick"
    >
      <input
        ref="manualElm"
        v-model="manualData"
        type="text"
        class="absolute inset-0"
        :class="[manualInput ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0', inputBoxClass]"
        :tabindex="-1"
        :name="'HsDatePicker-manual-input-' + uid"
        @blur="manualInputBlur()"
        @focus="manualInputfocus()"
      />
      <span :class="!manualInput ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'">
        {{ displayText }}
      </span>
      <span
        v-if="props.data === null && !props.hideTodayBtn && !props.readonly"
        class="today"
        :class="!manualInput ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
        @click.stop="datePickerToday()"
      >
        {{ props.mode === 'time' ? 'Now' : 'Today' }}
      </span>
    </div>
    <template #right-icons>
      <template v-if="!props.hideDeleteBtn && !props.readonly">
        <button
          :class="!disabled ? 'text-error cursor-pointer hover:bg-error/[0.1] active:bg-error/[0.2]' : ''"
          tabindex="-1"
          @click.stop="iconEventDelete()"
        >
          <i class="fa-solid fa-delete-left"></i>
        </button>
      </template>
      <slot name="right-icons" :disabled="disabled" />
    </template>
  </InputFrame>
  <ClientOnly>
    <UPopover
      v-model:open="open"
      arrow
      :reference="openBtn"
      :portal="props.portal"
      :open-delay="10"
      :same-width="false"
      strategy="absolute"
      :content="content"
    >
      <template #content>
        <div
          class="calender-modal min-w-[200px]"
          :style="{
            '--selected-color': themeColor,
            '--error-color': themeErrorColor,
            '--ui-primary': themeColor,
            '--ui-secondary': themeWeekColor,
          }"
        >
          <UCalendar
            v-if="props.mode !== 'time'"
            :model-value="calendarValue"
            class="p-2"
            :locale="displayLocale"
            :min-value="calendarMinValue"
            :max-value="calendarMaxValue"
            color="secondary"
            :ui="{}"
            @update:model-value="(v:any) => changeCalender(v)"
          />
          <div v-if="props.mode === 'all' || props.mode === 'time'" class="grid grid-cols-2 gap-1 p-1">
            <USelect
              :model-value="HH"
              :items="listHH"
              class=""
              placeholder="HH"
              @update:model-value="(v:any) => hhValueChange(v)"
            />
            <USelect
              :model-value="MM"
              :items="listMM"
              class=""
              placeholder="mm"
              @update:model-value="(v:any) => mmValueChange(v)"
            />
          </div>
        </div>
      </template>
    </UPopover>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.nac-c-input-p {
  width: 100%;
  height: 100%;
  padding: 0 4px;
  &:not(.readonly) {
    cursor: pointer;
  }

  .today {
    margin: 0 0 0 4px;
    border-radius: 4px;
    border: solid 1px #f68708;
    background-color: rgb(255, 246, 237);
    color: #e26f2c;
    font-size: 12px;
    padding: 1px 4px;
  }

  .flatpickr-body {
    position: absolute;
    opacity: 0 !important;
    top: 0px;
    height: 40px;
    height: 100%;
    width: 40px;
    left: 0;
    z-index: -1;
    pointer-events: none;
  }
}

.nac-c-input-p {
  display: flex;
  align-items: center;
  &.display-left {
    justify-content: flex-start;
  }

  &.display-center {
    justify-content: center;
  }

  &.display-right {
    justify-content: flex-end;
  }
}

.disabled {
  .nac-c-input-p {
    cursor: default;
    .today {
      display: none;
    }
  }
}
.calender-modal:deep(*) {
  [data-reka-calendar-cell-trigger] {
    cursor: pointer;
    &[data-today]:not([data-selected]) {
      color: var(--selected-color) !important;
    }
    &[data-disabled] {
      background-color: #afafaf !important;
      color: white !important;
    }
  }
  [data-selected] {
    background: var(--selected-color) !important;
    color: white !important;
  }
  [data-reka-calendar-cell-trigger]:hover:not([data-selected]):not([data-disabled]) {
    @media (hover: hover) {
      // @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--selected-color) 20%, transparent);
      // }
    }
  }
  [data-reka-calendar-cell-trigger]:hover:not([data-selected])[data-disabled] {
    @media (hover: hover) {
      background-color: color-mix(in oklab, var(--error-color) 50%, transparent);
    }
  }
}
</style>
