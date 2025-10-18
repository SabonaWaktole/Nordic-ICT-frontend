export interface AdminModel {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface AdminCreateInput {
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface AdminRepository {
  getByEmail(email: string): Promise<AdminModel>;
  list(): Promise<AdminModel[]>;
  create(input: AdminCreateInput): Promise<AdminModel>; // POST /new
  update(id: number, input: Partial<AdminCreateInput>): Promise<AdminModel>; // PUT /update/{id}
  delete(id: number): Promise<void>; // DELETE /delete/{id}
  uploadPhoto(file: File, adminId: number): Promise<string>; // POST /upload-photo -> public URL
}
