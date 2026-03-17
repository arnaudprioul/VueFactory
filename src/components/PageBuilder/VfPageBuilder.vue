<template>
	<div
			ref="pageBuilderRef"
			:class="pageBuilderClasses"
			:style="pageBuilderStyles"
	>
		<slot />
	</div>
</template>

<script
		lang="ts"
		setup
>
	import { computed } from 'vue'
	import type { StyleValue } from 'vue'

	// TODO - WIP

	interface Props {
		id?: string
		class?: string | string[] | Record<string, boolean>
		style?: string | string[] | Record<string, string>
		fullHeight?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {fullHeight: true})

	const pageBuilderStyles = computed(() => {
		return [
			props.style,
			props.fullHeight ? {height: '100%'} : undefined
		] as StyleValue
	})

	const pageBuilderClasses = computed(() => {
		return ['vf-page-builder', props.class]
	})

</script>
