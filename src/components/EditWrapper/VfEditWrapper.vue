<template>
	<div
			:class="editWrapperClasses"
			:style="editWrapperStyles"
	>
		<div class="vf-edit-wrapper__wrapper">
			<slot name="default"/>
		</div>
	</div>
</template>

<script
		lang="ts"
		setup
>
	import { computed, defineExpose, ref, useSlots, watch } from 'vue'
	import type { StyleValue } from 'vue'

	import type { IAutoPropComponentDefinition, IEditWrapperProps } from '../../interfaces'
	import { scanForAutoProps } from '../../utils'

	const props = withDefaults(defineProps<IEditWrapperProps>(), { slotName: 'default', autoDetectProps: true })

	const emit = defineEmits<{
		'auto-props': [components: Array<IAutoPropComponentDefinition>]
	}>()

	const slots = useSlots() as Record<string, (() => any) | undefined>

	const vnodes = ref<Array<any>>([])
	const detectedComponents = ref<Array<IAutoPropComponentDefinition>>([])

	watch(() => props, () => {
		if (typeof slots[props.slotName] !== 'undefined') {
			vnodes.value = slots[props.slotName]!()
		}

		if (slots[props.slotName] && props.autoDetectProps && vnodes.value.length) {
			const detected: Array<IAutoPropComponentDefinition> = scanForAutoProps(vnodes.value)
			detectedComponents.value = detected
			emit('auto-props', detected)
		}
	}, { immediate: true })

	defineExpose({ detectedComponents })

	// CLASS & STYLES

	const editWrapperStyles = computed(() => {
		return [props.style] as StyleValue
	})

	const editWrapperClasses = computed(() => {
		return ['vf-edit-wrapper', props.class]
	})

</script>

<style
		lang="scss"
		scoped
>

</style>
