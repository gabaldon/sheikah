<template>
  <div class="content">
    <div v-for="setting in settings" :key="setting">
      <SettingsOptionUnit
        v-if="setting === SETTINGS.UNIT"
        data-test="settings-unit"
        class="setting"
      />
      <SettingsLanguage
        v-if="setting === SETTINGS.LANGUAGE"
        data-test="settings-language"
        class="setting"
      />
      <SettingsAppearance
        v-if="setting === SETTINGS.APPEARANCE"
        data-test="settings-appereace"
        class="setting"
      />
      <ExportXprv
        v-if="setting === SETTINGS.EXPORT_XPRV"
        data-test="settings-xprv"
        class="setting"
      />
      <SettingsNotificationList
        v-if="setting === SETTINGS.NOTIFICATIONS"
        data-test="settings-notifications"
        class="setting"
      />
      <Community
        v-if="setting === SETTINGS.COMMUNITY"
        data-test="settings-community"
        class="setting"
      />
      <SettingsResync
        v-if="setting === SETTINGS.RESYNC"
        data-test="settings-resync"
        class="setting"
      />
    </div>
  </div>
</template>

<script>
import SettingsOptionUnit from '@/components/SettingsOptionUnit'
import SettingsLanguage from '@/components/SettingsLanguage'
import SettingsNotificationList from '@/components/SettingsNotificationList'
import SettingsAppearance from '@/components/SettingsAppearance'
import SettingsResync from '@/components/SettingsResync'
import ExportXprv from '@/components/ExportXprv'
import Community from '@/components/Community'
import { SETTINGS } from '@/constants'

export default {
  name: 'SettingsSection',
  components: {
    SettingsOptionUnit,
    ExportXprv,
    SettingsResync,
    Community,
    SettingsNotificationList,
    SettingsLanguage,
    SettingsAppearance,
  },
  props: {
    settings: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      SETTINGS,
    }
  },
}
</script>

<style scoped lang="scss">
.content {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.setting {
  margin-bottom: 16px;
  width: 40vw;
}
</style>
