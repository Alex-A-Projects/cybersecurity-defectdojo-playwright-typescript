/** Minimal v2 TestType DTO — verified against /api/v2/oa3/schema/ on 2026-10-20. */
export interface TestTypeDto {
  id: number;
  name: string;
  static_tool: boolean;
  dynamic_tool: boolean;
  active?: boolean;
}
