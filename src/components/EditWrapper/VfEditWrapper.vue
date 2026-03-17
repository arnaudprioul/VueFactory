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
	import { computed, ref, useSlots, watch } from 'vue'
	import type { StyleValue } from 'vue'

	import type { IAutoPropComponentDefinition, IEditWrapperProps } from '../../interfaces'
	import { scanForAutoProps } from '../../utils'

	// TODO - WIP

	const props = withDefaults(defineProps<IEditWrapperProps>(), {slotName: 'default', autoDetectProps: true})

	const slots = useSlots() as Record<string, (() => any) | undefined>

	const vnodes = ref<Array<any>>([])

	watch(() => props, () => {
		if (typeof slots[props.slotName] !== "undefined") {
			vnodes.value = slots[props.slotName]!()
		}

		if (slots[props.slotName] && props.autoDetectProps && vnodes) {
			const _propsTypes: Array<IAutoPropComponentDefinition> = scanForAutoProps(vnodes.value)

			console.log(_propsTypes)
		}
	}, {
		immediate: true
	})

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
