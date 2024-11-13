// components/map/d3-map/utils.ts
interface CountyFile {
  exists: boolean;
  path: string | null;
  alternativePaths: string[];
}

export const checkCountyFile = async (
  countyName: string
): Promise<CountyFile> => {
  const sanitizedName = countyName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  // List of possible paths where county files might be located
  const possiblePaths = [
    `/counties/${sanitizedName}.json`,
    `/counties/geojson/${sanitizedName}.json`,
    `/counties/${countyName.toLowerCase()}.json`,
    `/public/counties/${sanitizedName}.json`,
  ];

  for (const path of possiblePaths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        return {
          exists: true,
          path,
          alternativePaths: possiblePaths.filter((p) => p !== path),
        };
      }
    } catch (error) {
      console.log(`Failed to check path: ${path}`);
    }
  }

  return {
    exists: false,
    path: null,
    alternativePaths: possiblePaths,
  };
};
