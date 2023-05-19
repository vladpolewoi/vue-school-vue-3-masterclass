<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <VeeField
      :modelValue="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :name="name"
      :label="label"
      :id="name"
      class="form-input"
      v-bind="$attrs"
    />
    <VeeErrorMessage :name="name" class="form-error" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
});
</script>
