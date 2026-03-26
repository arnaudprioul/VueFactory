import type { IEditableProp } from '../interfaces/editable-prop.interface'
import { DEFAULT_BLOCK_PROPS } from '../consts/default-block-props.const'

/**
 * Returns the merged editable props for a block:
 * - starts with the defaults for the block type
 * - block-level meta.editableProps override defaults for the same key
 * - block-level props with unknown keys are appended
 */
export const resolveEditableProps = (
  type: string,
  blockProps: IEditableProp[] = [],
): IEditableProp[] => {
  const defaults = DEFAULT_BLOCK_PROPS[type] ?? []
  const merged = [...defaults]

  for (const prop of blockProps) {
    const idx = merged.findIndex((p) => p.key === prop.key)
    if (idx >= 0) merged[idx] = prop
    else merged.push(prop)
  }

  return merged
}
