<template>
	<div class="vf-css-box">
		<div class="vf-css-box__wrapper">
			<div class="vf-css-box__header">
				<h3 class="vf-css-box__title">CSS box</h3>
			</div>

			<div class="vf-css-box__content">
				<div class="vf-css-box__box vf-css-box__box--margin">
					<span class="vf-css-box__label">Margin</span>

					<input
							v-model="margin.top"
							class="vf-css-box__input vf-css-box__input--block vf-css-box__input--top"
							placeholder="-"
							type="number"
					/>
					<input
							v-model="margin.right"
							class="vf-css-box__input vf-css-box__input--inline vf-css-box__input--right"
							placeholder="-"
							type="number"
					/>
					<input
							v-model="margin.bottom"
							class="vf-css-box__input vf-css-box__input--block vf-css-box__input--bottom"
							placeholder="-"
							type="number"
					/>
					<input
							v-model="margin.left"
							class="vf-css-box__input vf-css-box__input--inline vf-css-box__input--left"
							placeholder="-"
							type="number"
					/>

					<div class="vf-css-box__box vf-css-box__box--border">
						<span class="vf-css-box__label">Border</span>

						<input
								v-model="border.top"
								class="vf-css-box__input vf-css-box__input--block vf-css-box__input--top"
								placeholder="-"
								type="number"
						/>
						<input
								v-model="border.right"
								class="vf-css-box__input vf-css-box__input--inline vf-css-box__input--right"
								placeholder="-"
								type="number"
						/>
						<input
								v-model="border.bottom"
								class="vf-css-box__input vf-css-box__input--block vf-css-box__input--bottom"
								placeholder="-"
								type="number"
						/>
						<input
								v-model="border.left"
								class="vf-css-box__input vf-css-box__input--inline vf-css-box__input--left"
								placeholder="-"
								type="number"
						/>

						<div class="vf-css-box__box vf-css-box__box--padding">
							<span class="vf-css-box__label">Padding</span>

							<input
									v-model="padding.top"
									class="vf-css-box__input vf-css-box__input--block vf-css-box__input--top"
									placeholder="-"
									type="number"
							/>
							<input
									v-model="padding.right"
									class="vf-css-box__input vf-css-box__input--inline vf-css-box__input--right"
									placeholder="-"
									type="number"
							/>
							<input
									v-model="padding.bottom"
									class="vf-css-box__input vf-css-box__input--block vf-css-box__input--bottom"
									placeholder="-"
									type="number"
							/>
							<input
									v-model="padding.left"
									class="vf-css-box__input vf-css-box__input--inline vf-css-box__input--left"
									placeholder="-"
									type="number"
							/>

							<div class="vf-css-box__text"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script
		lang="ts"
		setup
>
	import { ref, watch } from 'vue'

	import type { ICssBoxProps } from '../../interfaces'

	type Sides = { top: string; right: string; bottom: string; left: string }

	const props = withDefaults(defineProps<ICssBoxProps>(), {})

	const margin = ref<Sides>({ top: '', right: '', bottom: '', left: '' })
	const border = ref<Sides>({ top: '', right: '', bottom: '', left: '' })
	const padding = ref<Sides>({ top: '', right: '', bottom: '', left: '' })

	const emit = defineEmits<{
		'update:padding': [value: Sides]
		'update:margin': [value: Sides]
		'update:border': [value: Sides]
	}>()

	function parseVal(val: number | string | undefined): string {
		if (val === undefined || val === '') return ''
		return String(typeof val === 'number' ? val : String(val).replace(/px$/, ''))
	}

	function parseSides(val: number | string | undefined): Sides {
		if (val === undefined) return { top: '', right: '', bottom: '', left: '' }
		if (typeof val === 'number') {
			const s = String(val)
			return { top: s, right: s, bottom: s, left: s }
		}
		const parts = String(val).trim().split(/\s+/).map(p => p.replace(/px$/, ''))
		if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] }
		if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] }
		if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] }
		return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] }
	}

	watch(() => props, () => {
		const padBase = parseSides(props.padding)
		padding.value = {
			top:    parseVal(props.paddingTop)    || padBase.top,
			right:  parseVal(props.paddingRight)  || padBase.right,
			bottom: parseVal(props.paddingBottom) || padBase.bottom,
			left:   parseVal(props.paddingLeft)   || padBase.left,
		}
		const marBase = parseSides(props.margin)
		margin.value = {
			top:    parseVal(props.marginTop)    || marBase.top,
			right:  parseVal(props.marginRight)  || marBase.right,
			bottom: parseVal(props.marginBottom) || marBase.bottom,
			left:   parseVal(props.marginLeft)   || marBase.left,
		}
		const borBase = parseSides(props.border)
		border.value = {
			top:    parseVal(props.borderTop)    || borBase.top,
			right:  parseVal(props.borderRight)  || borBase.right,
			bottom: parseVal(props.borderBottom) || borBase.bottom,
			left:   parseVal(props.borderLeft)   || borBase.left,
		}
	}, { immediate: true, deep: true })

	watch(margin,  (val) => emit('update:margin', val),  { deep: true })
	watch(border,  (val) => emit('update:border', val),  { deep: true })
	watch(padding, (val) => emit('update:padding', val), { deep: true })

</script>

<style
		lang="scss"
		scoped
>
	.vf-css-box {
		&__title {
			font-size: 12px;
			font-weight: 600;
			margin: 0 0 8px;
		}

		&__box {
			padding: 44px;
			position: relative;

			&--margin {
				background-color: #ffffff;
				border: 1px dashed #bababa;
				margin: 1px;
			}

			&--border {
				background-color: #f6f6f6;
				border: 1px dashed #d7d7d7;
			}

			&--padding {
				background-color: #ebebeb;
				border: 1px dashed #bababa;
			}
		}

		&__label {
			font-size: 9px;
			line-height: 9px;

			position: absolute;
			top: 6px;
			left: 5px;

			margin: 0;
			padding: 0;
		}

		&__input {
			font-size: 11px;
			line-height: 11px;
			text-align: center;

			position: absolute;

			padding: 3px 0;
			margin: 0;

			height: 24px;
			width: 34px;

			border: 1px solid #bdbdbd;

			&--block {
				left: 50%;
				transform: translateX(-50%);
			}

			&--inline {
				top: 50%;
				transform: translateY(-50%);
			}

			&--top {
				top: 6px;
			}

			&--right {
				right: 4px;
			}

			&--bottom {
				bottom: 6px;
			}

			&--left {
				left: 6px;
			}
		}

		&__text {
			text-align: center;
			font-size: 10px;
			line-height: 11px;
			border: 1px solid #bababa;
			height: 50px;
			background-color: #8c8c8c;
		}
	}
</style>
