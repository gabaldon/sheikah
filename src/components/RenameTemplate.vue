<template>
  <div class="info">
    <label class="label" data-test="name-label">{{ $t('name') }}</label>
    <el-input
      v-model="localName"
      data-test="template-name-input"
      :placeholder="$t('template_name_placeholder')"
    />
    <label class="label" data-test="description-label">{{
      $t('description')
    }}</label>
    <el-input
      v-model="localDescription"
      type="textarea"
      :rows="3"
      data-test="template-description-input"
      :placeholder="$t('template_description_placeholder')"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'RenameTemplate',
  props: {
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentName: this.name,
      currentDescription: this.description,
    }
  },
  computed: {
    localName: {
      get() {
        return this.name
      },
      set(val) {
        this.$store.commit('clearCurrentFocus')
        this.currentName = val
        this.renameTemplate({ id: this.id, name: val })
      },
    },
    localDescription: {
      get() {
        return this.description
      },
      set(val) {
        this.$store.commit('clearCurrentFocus')
        this.currentDescription = val
        this.updateTemplateDescription({ id: this.id, description: val })
      },
    },
  },
  watch: {
    name(val) {
      this.currentName = val
    },
    description(val) {
      this.currentDescription = val
    },
  },
  methods: {
    ...mapMutations(['renameTemplate', 'updateTemplateDescription']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';
@import '@/styles/theme.scss';

.info {
  align-items: center;
  column-gap: 16px;
  display: grid;
  grid-template-columns: max-content auto;
  grid-template-rows: auto auto;
  row-gap: 16px;

  .label {
    color: var(--text-medium-emphasis);
    font-size: 14px;
  }
}
</style>
