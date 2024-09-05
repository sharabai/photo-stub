const OverlayModuleNames = {
  UPLOAD_PICTURES: "upload_pictures",
  UPLOAD_COVER: "upload_cover",
  DELETE_PICTURES: "delete_pictures",
  SCHEMA: "schema",
  CREATE_CAT: "create_category",
  CREATE_GAL: "create_gallery",
  MODIFY_CAT: "modify_category",
  MODIFY_GAL: "modify_gallery",
  DELETE_CAT: "delete_category",
  DELETE_GAL: "delete_gallery",
  OTHERS: "others", // Add more modules as needed
};

const OverlayModuleUpdateIdBehaviors = {
  upload_pictures: () => true,
  upload_cover: () => false,
  delete_pictures: () => false,
  schema: () => true,
  create_category: () => true,
  create_gallery: () => true,
  modify_category: () => true,
  modify_gallery: () => true,
  delete_category: () => true,
  delete_gallery: () => true,
  others: () => true, // Default behavior for unspecified modules
};

const OverlayModuleResetModifiedDataBehaviors = {
  upload_pictures: () => true,
  upload_cover: () => false,
  // TODO: look into resetting modified data for picture deletion
  delete_pictures: () => false,
  schema: () => true,
  create_category: () => true,
  create_gallery: () => true,
  modify_category: () => true,
  modify_gallery: () => true,
  delete_category: () => true,
  delete_gallery: () => true,
  others: () => true, // Default behavior for unspecified modules
};

function updateOverlayIdBehavior(moduleName) {
  const behavior =
    OverlayModuleUpdateIdBehaviors[moduleName] ||
    OverlayModuleUpdateIdBehaviors.others;
  return behavior();
}

function resetModifiedDataBehavior(moduleName) {
  const behavior =
    OverlayModuleResetModifiedDataBehaviors[moduleName] ||
    OverlayModuleResetModifiedDataBehaviors.others;
  return behavior();
}

export default OverlayModuleNames;
export { updateOverlayIdBehavior, resetModifiedDataBehavior };
