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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
