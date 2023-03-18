import { TOptions, IBaseMappingOptions, TOutMap } from './types';

/**
 * - outMap:
 * A function or a string.
 *   If a function and no baseMap is used. Then that function should map src file path
 * to output file path.
 *   If baseMap is used, then the function is used to map src file to Out dir.
 *   The out dir is where the files will be mapped to relatively to the baseDir.
 *   If a string then it would mean its a directory and to be used with baseMap property.
 * If not. Then it would be the out dir. And mix will map the filename of the src to that out dir.
 *
 *   The combination of the two properties will allow flexible mapping with
 * base and out directory mapping type. Where both properties can have mapper
 * function for each file. Allowing a high flexibility for filtering out files
 * and there output settings.
 *
 * - baseMap:
 *   If baseMap is provided. As a function or a string.
 *   The outMap resolution would be treated as an out directory instead of file path.
 * And it would enable the mapping to out dirs and in relation to a base directory.
 *   If string then the base is a one directory for all files.
 *   If a function we filter and map the files to there according base that they should take.
 *
 * - specifier:
 * Can be a string or a to string mapping function
 *   The usage of the specifier will allow to take out that part of the output
 * file name for each mapping.
 *  If a mapping function that it allow more file level mapping and
 * filtering supporting having multiple specifier at once.
 * If no base system is used. Then the specifier only work if the outMap is a string (dir).
 * If it's a function instead then it's expected to map directly. And so no specifier.
 *
 * NOTE: baseMap only relevant one outMap is a folder
 *
 * NOTE: Specifier only relevant when out map is a folder too.
 */
export class OutConfig {
  public outMap: TOutMap;

  public baseMap?: TOutMap<string>;

  public specifier?: TOutMap<string>;

  public extensionMap?: any;

  constructor(options: TOptions) {
    this.outMap = options.outMap;
    this.baseMap = (options as IBaseMappingOptions).baseMap;
    this.specifier = (options as IBaseMappingOptions).specifier;
  }
}
