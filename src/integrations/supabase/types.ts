export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Dataset: {
        Row: {
          "10th_grade_score/SSC_score": number | null
          "12th_grade/Diploma_score/high_school_score": number | null
          App_Devopment: string | null
          "CGPA/GPA/Degree_score": number | null
          Cloud_Computing_Experience: number | null
          cluster: string | null
          College_or_university_name: string | null
          Cybersecurity_Experience: string | null
          "Data_Structures/Algorithms/Competitive_Programming": number | null
          Database_Experience: number | null
          Electronics_or_Arduino_Experience: string | null
          Field_of_study: string | null
          Job_role: string | null
          Machine_Learning_Experience: number | null
          Name: string | null
          No_of_Hackathon_participation: string | null
          "No_of_Non-Tech_Internships": string | null
          No_of_Tech_Internships: number | null
          "No.": number
          Number_of_projects_completed: string | null
          Other_Personal_Skills: number | null
          "Package(in LPA)": number | null
          Salary_Category: string | null
          Starting_Company: string | null
          Web_Devopment: number | null
        }
        Insert: {
          "10th_grade_score/SSC_score"?: number | null
          "12th_grade/Diploma_score/high_school_score"?: number | null
          App_Devopment?: string | null
          "CGPA/GPA/Degree_score"?: number | null
          Cloud_Computing_Experience?: number | null
          cluster?: string | null
          College_or_university_name?: string | null
          Cybersecurity_Experience?: string | null
          "Data_Structures/Algorithms/Competitive_Programming"?: number | null
          Database_Experience?: number | null
          Electronics_or_Arduino_Experience?: string | null
          Field_of_study?: string | null
          Job_role?: string | null
          Machine_Learning_Experience?: number | null
          Name?: string | null
          No_of_Hackathon_participation?: string | null
          "No_of_Non-Tech_Internships"?: string | null
          No_of_Tech_Internships?: number | null
          "No.": number
          Number_of_projects_completed?: string | null
          Other_Personal_Skills?: number | null
          "Package(in LPA)"?: number | null
          Salary_Category?: string | null
          Starting_Company?: string | null
          Web_Devopment?: number | null
        }
        Update: {
          "10th_grade_score/SSC_score"?: number | null
          "12th_grade/Diploma_score/high_school_score"?: number | null
          App_Devopment?: string | null
          "CGPA/GPA/Degree_score"?: number | null
          Cloud_Computing_Experience?: number | null
          cluster?: string | null
          College_or_university_name?: string | null
          Cybersecurity_Experience?: string | null
          "Data_Structures/Algorithms/Competitive_Programming"?: number | null
          Database_Experience?: number | null
          Electronics_or_Arduino_Experience?: string | null
          Field_of_study?: string | null
          Job_role?: string | null
          Machine_Learning_Experience?: number | null
          Name?: string | null
          No_of_Hackathon_participation?: string | null
          "No_of_Non-Tech_Internships"?: string | null
          No_of_Tech_Internships?: number | null
          "No."?: number
          Number_of_projects_completed?: string | null
          Other_Personal_Skills?: number | null
          "Package(in LPA)"?: number | null
          Salary_Category?: string | null
          Starting_Company?: string | null
          Web_Devopment?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
