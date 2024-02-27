class AddOldFormColumnToKanjis < ActiveRecord::Migration[7.1]
  def change
    add_column :kanjis, :old_form, :string, default: nil
  end
end
