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
	import { shallowRef, watch } from 'vue'

	import type { ICssBoxProps } from '../../interfaces'

	// TODO - WIP

	const props = withDefaults(defineProps<ICssBoxProps>(), {})

	const emit = defineEmits<{
		'update:padding': [value: typeof padding.value]
		'update:margin': [value: typeof margin.value]
		'update:border': [value: typeof border.value]
	}>()

	const margin = shallowRef({top: '', right: '', bottom: '', left: ''})
	const border = shallowRef({top: '', right: '', bottom: '', left: ''})
	const padding = shallowRef({top: '', right: '', bottom: '', left: ''})

	watch(() => props, () => {
		// TODO: sync from props to internal state
	})

	watch(margin, (val) => emit('update:margin', val))
	watch(border, (val) => emit('update:border', val))
	watch(padding, (val) => emit('update:padding', val))

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
