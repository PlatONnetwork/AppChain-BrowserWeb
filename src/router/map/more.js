const GovernableParameter = () => import('@/views/more/governable-parameter.vue')
const Fund = () => import('@/views/more/fund.vue')
const AddToExtension = () => import('@/views/more/add-to-extension.vue')
const CreateValidateNode = () => import('@/views/more/create-validate-node')
const RemoveValidateNode = () => import('@/views/more/remove-validate-node')

export const governableParameter = {
  path: '/governable-parameter',
  component: GovernableParameter,
  name: 'governableParameter'
}

export const foundationAddress = {
  path: '/foundation-address',
  component: Fund,
  name: 'foundationAddress'
}

// export const addToExtension = {
//   path: '/add-to-extension',
//   component: AddToExtension,
//   name: 'addToExtension'
// }

export const createValidateNode = {
  path: '/create-validate-node',
  component: CreateValidateNode,
  name: 'createValidateNode'
}

export const removeValidateNode = {
  path: '/remove-validate-node',
  component: RemoveValidateNode,
  name: 'removeValidateNode'
}
