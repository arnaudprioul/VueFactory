import { mount } from '@vue/test-utils';
import Origampagebuilder from './OrigamPageBuilder.vue';

describe('Spec Origampagebuilder', function () {
	it('mounts', () => {
		const wrapper = mount(Origampagebuilder);
		expect(wrapper)
			.toBeTruthy();
	});
});
